import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const countAdmins = sinon.stub();
const setupCompleted = sinon.stub();
const getSetting = sinon.stub();
const validatePassword = sinon.stub();
const passwordCheck = new Error('password validation reached');
class MeteorError extends Error {
	constructor(
		public error: string,
		reason: string,
	) {
		super(reason);
	}
}

const { registerUser } = proxyquire.noCallThru().load('../../../../server/meteor-methods/users/registerUser', {
	'@rocket.chat/models': { Roles: { countUsersInRole: countAdmins }, Users: {} },
	'meteor/accounts-base': { Accounts: {} },
	'meteor/check': { check: () => undefined, Match: { Optional: () => undefined, ObjectIncluding: () => undefined } },
	'meteor/ddp-rate-limiter': { DDPRateLimiter: {} },
	'meteor/meteor': { Meteor: { Error: MeteorError, methods: () => undefined } },
	'../../../lib/utils/stringUtils': { trim: (value: string) => value.trim() },
	'../../lib/RateLimiter': { RateLimiterClass: { limitMethod: () => 'rule' } },
	'../../lib/auth/passwordPolicy': { passwordPolicy: { validate: validatePassword } },
	'../../lib/getSetupWizardParameters': { isSetupWizardCompleted: setupCompleted },
	'../../lib/rooms/invites/validateInviteToken': { validateInviteToken: () => undefined },
	'../../lib/validateEmailDomain': { validateEmailDomain: () => undefined },
	'../../settings': { settings: { get: getSetting, watch: () => undefined } },
});

async function registrationError() {
	try {
		await registerUser({ name: 'Bootstrap test', username: 'bootstrap-test', email: 'bootstrap@example.test', pass: 'unused' });
		throw new Error('Expected registration to stop before creating a user');
	} catch (error) {
		return error;
	}
}

describe('registerUser bootstrap with disabled public registration', () => {
	beforeEach(() => {
		sinon.reset();
		getSetting.withArgs('Accounts_RegistrationForm').returns('Disabled');
		countAdmins.resolves(0);
		setupCompleted.returns(false);
		validatePassword.throws(passwordCheck);
	});

	it('lets the initial administrator reach normal password validation during setup', async () => {
		expect(await registrationError()).to.equal(passwordCheck);
		expect(countAdmins.calledWithExactly('admin')).to.equal(true);
	});

	it('blocks another registration as soon as an administrator exists, even before setup ends', async () => {
		countAdmins.resolves(1);
		expect(await registrationError()).to.have.property('error', 'error-user-registration-disabled');
		expect(validatePassword.called).to.equal(false);
	});

	it('blocks registration after setup even if no administrator remains', async () => {
		setupCompleted.returns(true);
		expect(await registrationError()).to.have.property('error', 'error-user-registration-disabled');
		expect(countAdmins.called).to.equal(false);
	});

	it('preserves explicitly enabled public registration', async () => {
		getSetting.withArgs('Accounts_RegistrationForm').returns('Public');
		setupCompleted.returns(true);
		countAdmins.resolves(1);
		expect(await registrationError()).to.equal(passwordCheck);
		expect(countAdmins.called).to.equal(false);
	});

	it('fails closed if the administrator lookup fails', async () => {
		const failure = new Error('database unavailable');
		countAdmins.rejects(failure);
		expect(await registrationError()).to.equal(failure);
		expect(validatePassword.called).to.equal(false);
	});
});
