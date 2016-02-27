System.register(["core/service/data/context", "core/common/commonService", "core/common/mapStrings"], function(exports_1) {
    var context_1, commonService_1, _mp;
    var EcProviderSpToolCommenter;
    return {
        setters:[
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcProviderSpToolCommenter = (function () {
                function EcProviderSpToolCommenter($mi, dCtx, c, recipientId) {
                    this.$mi = $mi;
                    this.dCtx = dCtx;
                    this.c = c;
                    this.recipientId = recipientId;
                    this.isInstructor = false;
                    this.isNew = false;
                    var authorRole = this.dCtx.user.persona.mpInstituteRole;
                    var author;
                    var recipient;
                    if (authorRole === _mp.EcMapInstituteRole.student) {
                        var spComment = this.dCtx.student.getOrAddComment(this.recipientId);
                        author = spComment.author.studentProfile.person;
                        recipient = spComment.recipient.studentProfile.person;
                        this.comment = spComment;
                    }
                    else {
                        var facComment = this.dCtx.faculty.getFacSpComment(this.recipientId);
                        author = facComment.faculty.faculty.person;
                        recipient = facComment.student.studentProfile.person;
                        facComment['mpCommentType'] = _mp.MpCommentType.signed;
                        this.comment = facComment;
                    }
                    this.recipientName = author.firstName + " " + author.lastName;
                    this.authorName = recipient.firstName + " " + recipient.lastName;
                    this.authorAvatar = author.avatarLocation || author.defaultAvatarLocation;
                    this.recipientAvatar = recipient.avatarLocation || recipient.defaultAvatarLocation;
                    this.isNew = this.comment.entityAspect.entityState === breeze.EntityState.Added;
                }
                EcProviderSpToolCommenter.prototype.cancel = function () {
                    if (this.comment.entityAspect.entityState.isAddedModifiedOrDeleted()) {
                        this.comment.entityAspect.rejectChanges();
                    }
                    this.$mi.dismiss('canceled');
                };
                //TODO: need to write this!
                EcProviderSpToolCommenter.prototype.delete = function () {
                };
                EcProviderSpToolCommenter.prototype.save = function () {
                    var _this = this;
                    var ctx = (this.authorRole === _mp.EcMapInstituteRole.student) ? 'student' : 'faculty';
                    var saveCtx = this.dCtx[ctx];
                    var swalSettings = {
                        title: "Oh no!, there was a problem saving this comment. Try saving again, or cancel the current comment and attempt this again later.",
                        type: "error",
                        allowEscapeKey: true,
                        confirmButtonText: 'Ok'
                    };
                    saveCtx.saveChanges()
                        .then(function () { return _this.$mi.close; })
                        .catch(function () {
                        _this.c.swal(swalSettings);
                    });
                };
                EcProviderSpToolCommenter.controllerId = 'app.provider.sptools.commenter';
                EcProviderSpToolCommenter.$inject = ['$uibModalInstance', context_1.default.serviceId, commonService_1.default.serviceId, 'recipientId'];
                return EcProviderSpToolCommenter;
            })();
            exports_1("default", EcProviderSpToolCommenter);
        }
    }
});
