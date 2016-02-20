//export interface IResponsesPerPeer {
//    peer: Ecat.Shared.Model.MemberInGroup;
//    respCount: number;
//}

//export default class EcScoreService {
//    static serviceId = 'core.score';

//    calcAssesseeComposites(groupMember: Ecat.Shared.Model.MemberInGroup): Array<ecat.IAssesseeComposite> {
//        var compositeCollection: Array<ecat.IAssesseeComposite>;

//        //go through all group Peers (includes self)
//        groupMember.groupPeers.forEach(peer => {
//            //set up a assessee composites object for this peer
//            var assesseeComposite: ecat.IAssesseeComposite;
//            assesseeComposite.groupMember = peer;
//            assesseeComposite.hEReceived = 0;
//            assesseeComposite.eReceived = 0;
//            assesseeComposite.nDReceived = 0;
//            assesseeComposite.iEReceived = 0;
//            assesseeComposite.overall = 0;

//            //on each peer, go through all the assessee responses (will be only responses from the passed in member)
//            peer.assesseeSpResponses.forEach(resp => {
//                switch (resp.itemModelScore) {
//                    case -2: assesseeComposite.iEReceived += 1; break;
//                    case -1: assesseeComposite.iEReceived += 1; break;
//                    case 0: assesseeComposite.nDReceived += 1; break;
//                    case 1: assesseeComposite.eReceived += 1; break;
//                    case 2: assesseeComposite.eReceived += 1; break;
//                    case 3: assesseeComposite.hEReceived += 1; break;
//                    case 4: assesseeComposite.hEReceived += 1; break;
//                }

//                assesseeComposite.overall += resp.itemModelScore;
//            });

//            //get the average score
//            assesseeComposite.overall = assesseeComposite.overall / groupMember.group.assignedSpInstr.inventoryCollection.length;

//            compositeCollection.push(assesseeComposite);
//        });

//        return compositeCollection;
//    }

//    calcInventoryOveralls(groupMember: Ecat.Shared.Model.MemberInGroup): Array<ecat.IInventoryWithOveralls> {
//        var iwoCollection: Array<ecat.IInventoryWithOveralls>;
//        //set up an IWO object for each inventory
//        groupMember.group.assignedSpInstr.inventoryCollection.forEach(inv => {
//            var invWithOv: ecat.IInventoryWithOveralls;
//            invWithOv.inventory = inv;
//            invWithOv.self = '';
//            invWithOv.peerAggregate = 0;
//            invWithOv.peerOverall = '';
//            invWithOv.fac = '';

//            iwoCollection.push(invWithOv);
//        });

//        //groupPeers still has self
//        //var peers = groupMember.groupPeers.filter(gm => {
//        //    if (gm.id !== groupMember.id) {
//        //        return true;
//        //    }

//        //    return false;
//        //});

//        //go through each peer (including self)
//        groupMember.groupPeers.forEach(peer => {
//            if (peer.id !== groupMember.id) {
//                //go through each assessee response on the peer, find the corresponding IWO and add the score to that IWO
//                peer.assesseeSpResponses.forEach(resp => {
//                    var iwo = iwoCollection.filter(iwo => {
//                        if (iwo.inventory.id === resp.inventoryItemId) {
//                            return true;
//                        }
//                        return false;
//                    });

//                    iwo[0].peerAggregate += resp.itemModelScore;
//                });
//            } else {
//                peer.assesseeSpResponses.forEach(resp => {
//                    var iwo = iwoCollection.filter(iwo => {
//                        if (iwo.inventory.id === resp.inventoryItemId) {
//                            return true;
//                        }
//                        return false;
//                    });

//                    iwo[0].self = this.getResultString(resp.itemModelScore);
//                });
//            }
//        });

//        //var selfAssess = groupMember.assesseeSpResponses.filter(resp => {
//        //    if (resp.assessorId === groupMember.id) {
//        //        return true;
//        //    }
//        //    return false;
//        //});

//        //selfAssess.forEach(resp => {
//        //    iwoCollection.forEach(iwo => {
//        //        if (resp.inventoryItemId === iwo.inventory.id) {
//        //            iwo.self = this.getResultString(resp.itemModelScore);
//        //        }
//        //    });
//        //});

//        //get all the facilitator assess responses for the passed in member and do the same we did with the peer responses
//        //will this only have the responses for the passed in member? not sure...

//        var facAssess = groupMember.group.facSpResponses.filter(resp => {
//            if (resp.assesseeId === groupMember.id) {
//                return true;
//            }
//           return false;
//        });

//        //facAssess.forEach(resp => {
//        //    iwoCollection.forEach(iwo => {
//        //        if (resp.relatedInventoryId === iwo.inventory.id) {
//        //            iwo.fac = this.getResultString(resp.itemResponseScore);
//        //        }
//        //    });
//        //});

//        //groupMember.group.spInstrument.inventoryCollection.forEach(inv => {
//        //    var invWithOv: IInventoryWithOveralls;
//        //    invWithOv.inventory = inv;
//        //    var peerAggregate = 0;

//        //    groupMember.groupPeers.forEach(peer => {
//        //        peer.assesseeSpResponses.forEach(spr => {
//        //            if (spr.inventoryItemId === inv.id) {
//        //                peerAggregate += spr.itemModelScore;
//        //            }
//        //        });
//        //    });

//        //    //groupMember.assesseeSpResponses.forEach(spr => {
//        //    //    if (spr.inventoryItemId === inv.id) {
//        //    //        if (spr.assessorId === spr.assesseeId) {
//        //    //            invWithOv.self = this.getResultString(spr.itemModelScore);
//        //    //        } else {
//        //    //            peerAggregate += spr.itemModelScore;
//        //    //        }
//        //    //    }
//        //    //});

//        //    invWithOv.peerOverall = this.getResultString(peerAggregate / groupMember.groupPeers.length);

//        //    groupMember.group.facSpReponses.forEach(spr => {
//        //        if (spr.relatedInventoryId === inv.id) {
//        //            if (spr.assesseeId === groupMember.id) {
//        //                invWithOv.fac = this.getResultString(spr.itemResponseScore);
//        //            }
//        //        }
//        //    });

//        //    iwoCollection.push(invWithOv);
//        //});

//        return iwoCollection;
//    }

//    private getResultString(respScore: number): string {
//        //get the word picture from the score
//        //are we going to display it this way?
//        if (respScore < -1) { return 'Ineffective Always'; }
//        if (respScore >= -1 && respScore < 0) { return 'Ineffective Usually'; }
//        if (respScore >= 0 && respScore < 1) { return 'Not Displayed'; }
//        if (respScore >= 1 && respScore < 2) { return 'Effective Usually'; }
//        if (respScore >= 2 && respScore < 3) { return 'Effective Always'; }
//        if (respScore >= 3 && respScore < 4) { return 'Highly Effective Usually'; }
//        if (respScore >= 4) { return 'Highly Effective Always'; }
//    }

//    calcStudentSpStatus(group: ecat.entity.IWorkGroup): Array<ecat.IStudentSpStatus> {
//        var statusCollection: ecat.IStudentSpStatus[] = [];

//        //go through all the members in the group
//        group.groupMembers.forEach(gm => {
//            //set up an SpStatus object and ResponsesPerPeer array for them
//            var spStatus: ecat.IStudentSpStatus;
//            spStatus.groupMember = gm;
//            spStatus.peersComplete = 0;
//            spStatus.selfComplete = false;
//            spStatus.stratsComplete = 0;
//            spStatus.assessorComposite.eGiven = 0;
//            spStatus.assessorComposite.hEGiven = 0;
//            spStatus.assessorComposite.iEGiven = 0;
//            spStatus.assessorComposite.nDGiven = 0;

//            var respPerPeerCollection: IResponsesPerPeer[] = [];
//            //go through all the member's peers
//            gm.groupPeers.forEach(peer => {
//                //set up a ResponsesPerPeer object
//                var respPerPeer: IResponsesPerPeer;
//                respPerPeer.peer = peer;
//                respPerPeer.respCount = 0;

//                //go through each assessee response on this peer, grab what score they gave and add to the respCount
//                peer.assesseeSpResponses.forEach(resp => {
//                    switch (resp.itemModelScore) {
//                        case -2: spStatus.assessorComposite.iEGiven += 1; break;
//                        case -1: spStatus.assessorComposite.iEGiven += 1; break;
//                        case 0: spStatus.assessorComposite.nDGiven += 1; break;
//                        case 1: spStatus.assessorComposite.eGiven += 1; break;
//                        case 2: spStatus.assessorComposite.eGiven += 1; break;
//                        case 3: spStatus.assessorComposite.hEGiven += 1; break;
//                        case 4: spStatus.assessorComposite.hEGiven += 1; break;
//                    }

//                    respPerPeer.respCount += 1;
//                });

//                respPerPeerCollection.push(respPerPeer);

//                //see if the member stratted this peer
//                if (peer.assesseeStratResponse.length > 0) {
//                    spStatus.stratsComplete += 1;
//                }
//            });

//            //see if the amount of responses this member did per peer is the same as the amount of inventories on this group's instrument
//            respPerPeerCollection.forEach(rpp => {
//                if (rpp.respCount === group.assignedSpInstr.inventoryCollection.length) {
//                    if (rpp.peer.id === gm.id) {
//                        spStatus.selfComplete = true;
//                    } else {
//                        spStatus.peersComplete += 1;
//                    }
//                }
//            });

//            statusCollection.push(spStatus);
//        });

//        return statusCollection;
//    }
//}
