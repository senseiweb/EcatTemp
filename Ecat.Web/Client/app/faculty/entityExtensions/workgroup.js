System.register(["core/common/mapStrings"], function(exports_1) {
    var _mp;
    var FacWorkGroupInitizer, FacWorkGroupExt, facWorkGrpEntityExt;
    return {
        setters:[
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            FacWorkGroupInitizer = (function () {
                function FacWorkGroupInitizer(facWorkGrouppEntity) {
                    if (facWorkGrouppEntity.assignedSpInstr && facWorkGrouppEntity.groupMembers) {
                        facWorkGrouppEntity.getFacAssessStatus();
                    }
                }
                return FacWorkGroupInitizer;
            })();
            exports_1("FacWorkGroupInitizer", FacWorkGroupInitizer);
            FacWorkGroupExt = (function () {
                function FacWorkGroupExt() {
                }
                return FacWorkGroupExt;
            })();
            exports_1("FacWorkGroupExt", FacWorkGroupExt);
            exports_1("facWorkGrpEntityExt", facWorkGrpEntityExt = {
                entityName: _mp.EcMapEntityType.crseStudInGrp,
                ctorFunc: FacWorkGroupExt,
                initFunc: function (FacWorkGrpEntity) { return new FacWorkGroupInitizer(FacWorkGrpEntity); }
            });
        }
    }
});
