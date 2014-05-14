'use strict';

angular.module('bsis')
  .controller('HeaderCtrl', function ($scope, $location) {


			$scope.currentSection = 'HOME';
			$scope.sectionList = [
			    {'title': 'DONORS',
			     'href': '#donors',
			 	 'glyph': 'glyphicon-tint'},
			    {'title': 'COMPONENTS',
			     'href': '#components',
			     'glyph': 'glyphicon-tasks'},
			    {'title': 'TESTING',
			     'href': '#testing',
			     'glyph': 'glyphicon-inbox'},
			    {'title': 'INVENTORY',
			     'href': '#inventory',
			     'glyph': 'glyphicon-tag'},
			    {'title': 'REPORTS',
			     'href': '#reports',
			     'glyph': 'glyphicon-stats'},
			    {'title': 'MOBILE CLINIC',
			     'href': '#mobile',
			     'glyph': 'glyphicon-road'},
			    {'title': 'SETTINGS',
			     'href': '#settings',
			     'glyph': 'glyphicon-cog'}
			  ];

	$scope.$on('$locationChangeStart', function(event){

		if(~$location.path().indexOf('donors')){
			$scope.currentSection = 'DONORS';
			$scope.sectionList = [
			    {'title': 'HOME',
			     'href': '#',
			 	 'glyph': 'glyphicon-home'},
			    {'title': 'COMPONENTS',
			     'href': '#components',
			     'glyph': 'glyphicon-tasks'},
			    {'title': 'TESTING',
			     'href': '#testing',
			     'glyph': 'glyphicon-inbox'},
			    {'title': 'INVENTORY',
			     'href': '#inventory',
			     'glyph': 'glyphicon-tag'},
			    {'title': 'REPORTS',
			     'href': '#reports',
			     'glyph': 'glyphicon-stats'},
			    {'title': 'MOBILE CLINIC',
			     'href': '#mobile',
			     'glyph': 'glyphicon-road'},
			    {'title': 'SETTINGS',
			     'href': '#settings',
			     'glyph': 'glyphicon-cog'}
			  ];
		}
		else{
			$scope.currentSection = 'HOME';
			$scope.sectionList = [
			    {'title': 'DONORS',
			     'href': '#donors',
			 	 'glyph': 'glyphicon-tint'},
			    {'title': 'COMPONENTS',
			     'href': '#components',
			     'glyph': 'glyphicon-tasks'},
			    {'title': 'TESTING',
			     'href': '#testing',
			     'glyph': 'glyphicon-inbox'},
			    {'title': 'INVENTORY',
			     'href': '#inventory',
			     'glyph': 'glyphicon-tag'},
			    {'title': 'REPORTS',
			     'href': '#reports',
			     'glyph': 'glyphicon-stats'},
			    {'title': 'MOBILE CLINIC',
			     'href': '#mobile',
			     'glyph': 'glyphicon-road'},
			    {'title': 'SETTINGS',
			     'href': '#settings',
			     'glyph': 'glyphicon-cog'}
			  ];
		}

	});

	$scope.status = {
		isopen: false
	};

	$scope.toggled = function(open) {
		console.log('Dropdown is now: ', open);
	};

	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};

	

  });