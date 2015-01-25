import CustomElement from 'lib/CustomElement'

CustomElement.register('github-api-test', require('GithubApiTest'));
CustomElement.register('print-request', require('PrintRequest'));
CustomElement.register('logging-test', require('LoggingTest'));
CustomElement.register('user-badge', require('UserBadge'));
CustomElement.register('issue-list', require('IssueList'));
CustomElement.register('issue-view', require('IssueView'));
CustomElement.register('site-nav', require('SiteNav'));
CustomElement.register('site-footer', require('Footer'));
CustomElement.register('logout-button', require('LogoutButton'));
CustomElement.register('create-issue', require('CreateIssue'));
CustomElement.register('thank-you', require('ThankYou'));

// dev elements
CustomElement.register('site-devnav', require('siteNavDev.html'));

// custom extensions extend current html elements
require('LoginLink').register('a', 'login-link')
// require('PayloadCreate').register('a', 'payload-create')
