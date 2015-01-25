import CustomElement from 'lib/CustomElement'

CustomElement.register('github-api-test', require('GithubApiTest'));
CustomElement.register('payload-create', require('PayloadCreate'));
CustomElement.register('print-request', require('PrintRequest'));
CustomElement.register('logging-test', require('LoggingTest'));
CustomElement.register('user-badge', require('UserBadge'));
CustomElement.register('issue-list', require('IssueList'));
CustomElement.register('issue-view', require('IssueView'));
CustomElement.register('site-nav', require('SiteNav'));

CustomElement.register('site-devnav', require('siteNavDev.html'));
