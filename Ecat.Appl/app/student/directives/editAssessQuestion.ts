import assessments from 'student/features/assessments/assessments'

interface IInputMaskScope extends angular.IScope {
    editAssessQuestion: any;
}

export default class EcEditAssessQuestion implements angular.IDirective {
    static directiveId = 'editAssessQuestion';
    restrict = 'E';
    scope = {
        inputMask: '='
    }

}