
export default class EcValidateStrat implements angular.IDirective {
    static directiveId = 'validateStrat';
    restrict = 'A';
    require = 'ngModel';
    scope = true;
    template = '<input required class="form-control" id="inputError1" type="text" style="width: 100px">';
    link = (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {

    
    }





    
    
}