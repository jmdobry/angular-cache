docsApp.directive.documentationGroupList = function($timeout) {
	return {
		restrict: 'E',
		replace: true,
		template: [
			'<div class="documentation-groups">',
			'<div ng-repeat="group in docGroups" class="documentation-group" ng-show="group.visible">',
			'<h2><i class="{{group.groupIcon}} icon-white"></i> {{group.title}} </h2>',
			'<div class="documentation-group-info sidenav">',
			'<ul class="list-group nav">',
			'<li ng-repeat="section in group.sections" class="documentation-group-section list-group-item">',
			'<a href="{{section.url}}">{{section.title}}</a>',
			'</li>',
			'</ul>',
			'</div>',
			'</div>',
			'</div>'
		].join(''),
		link: function(scope, element, attrs) {
			scope.docGroups = scope.$parent.docGroups;
		}
	};
};
