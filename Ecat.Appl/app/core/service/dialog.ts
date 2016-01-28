import swal from "sweetalert"

export default class EcDialogService
{
    static serviceId = 'core.dialog';
    static $inject = ['$q','$templateCache'];

    constructor(private $q:angular.IQService, private $tc: angular.ITemplateCacheService) {
        
    }

    warningConfirmAlert(warningTitle: string, warningContent: string, confirmBtnText: string): angular.IPromise<any> {

        const settings: SweetAlert.Settings = {
            title: warningTitle
        }

    const deferred = this.$q.defer();

        settings.text = warningContent;
        settings.allowEscapeKey = false;
        settings.type = 'warning';
        settings.showCancelButton = true;
        settings.confirmButtonColor = '#f44336';
        settings.confirmButtonText = confirmBtnText;
        settings.closeOnCancel = false;
        settings.closeOnConfirm = false;

        swal(settings, (confirmed) => {
            if (confirmed) {
                deferred.resolve();
            } else {
                swal.close();
                deferred.reject('User Canceled');
            }
        });

        return deferred.promise;
    }

    registerAlert(): void {
        const template = '';
        
        const registerSettings: SweetAlert.Settings = {
            title: 'Registration Type'
        }
        registerSettings.allowEscapeKey = true;
        registerSettings.allowOutsideClick = false;
        registerSettings.html = true;


        return swal(registerSettings);

    }

}