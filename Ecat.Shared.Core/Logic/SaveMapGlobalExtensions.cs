﻿using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Ecat.Shared.Core.Interface;

namespace Ecat.Shared.Core.Logic
{
    using SaveMap = Dictionary<Type, List<EntityInfo>>;

    public static class SaveMapGlobalExtensions
    {
        public static SaveMap RemoveMaps(this SaveMap saveMap, IEnumerable<Type> unauthorizedTypes)
        {
            foreach (var uat in unauthorizedTypes)
            {
                saveMap.Remove(uat);
            }

            return saveMap;
        }

        public static SaveMap AuditMaps(this SaveMap saveMap, int loggedInUserId)
        {
            var predicate =
                saveMap
                .Where(map => typeof (IAuditable)
                .IsAssignableFrom(map.Key))
                .SelectMany(map => map.Value)
                .Select(info => info);

            foreach (var info in predicate)
            {
                var auditable = info.Entity as IAuditable;

                Contract.Assert(auditable != null);

                auditable.ModifiedById = loggedInUserId;
                auditable.ModifiedDate = DateTime.Now;

                info.OriginalValuesMap["ModifiedById"] = null;
                info.OriginalValuesMap["ModifiedDate"] = null;
            }

            return saveMap;
        }

        public static SaveMap SoftDeleteMap(this SaveMap saveMap, int loggedInUserId)
        {

            var predicate =
                saveMap
                .Where(map => typeof(ISoftDelete)
                .IsAssignableFrom(map.Key))
                .SelectMany(map => map.Value)
                .Select(info => info);

            foreach (var info in predicate)
            {
                var softDeletable = info.Entity as ISoftDelete;

                Contract.Assert(softDeletable != null);

                softDeletable.DeletedById = loggedInUserId;
                softDeletable.DeletedDate = DateTime.Now;
                softDeletable.IsDeleted = true;

                info.OriginalValuesMap["DeletedById"] = null;
                info.OriginalValuesMap["DeletedDate"] = null;
                info.OriginalValuesMap["IsDeleted"] = null;
            }

            return saveMap;
        }

        public static bool HasMap<T>(this SaveMap saveMap, T key)
        {
            return saveMap[key.GetType()] != null;
        } 
    }
}
