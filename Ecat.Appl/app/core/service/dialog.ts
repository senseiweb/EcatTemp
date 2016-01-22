import swal from 'sweetalert'

export default class EcDialogService
{
    static serviceId = 'core.dialog';
    static $inject = ['$templateCache', '$q'];
    swal = swal;

    constructor(private $tc: angular.ITemplateCacheService,private $q: angular.IQService) {
        
    }

    sucessConfirmAlert(title: string, content: string): void {
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

        this.swal(settings, (confirmed) => {
            if (confirmed) {
                deferred.resolve();
            } else {
                this.swal.close();
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


        return this.swal(registerSettings);

    }

}