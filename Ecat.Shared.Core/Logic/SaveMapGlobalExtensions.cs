using System;
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

        public static SaveMap AuditMap(this SaveMap saveMap, int loggedInUserId)
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

                if (info.OriginalValuesMap == null) continue;

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

                if (info.OriginalValuesMap == null) continue;

                info.OriginalValuesMap["DeletedById"] = null;
                info.OriginalValuesMap["DeletedDate"] = null;
                info.OriginalValuesMap["IsDeleted"] = null;
            }

            return saveMap;
        }

        public static SaveMap MergeMap(this SaveMap saveMap, SaveMap newMap)
        {
            foreach (var map in newMap)
            {
                List<EntityInfo> infos;

                var hasKey = saveMap.TryGetValue(map.Key, out infos);
                if (hasKey)
                {
                    saveMap[map.Key].AddRange(infos);
                }
                else
                {
                    saveMap.Add(map.Key, map.Value);
                }
            }
            return saveMap;
        }

        //public static bool HasMap<T>(this SaveMap saveMap, T key)
        //{
        //    return saveMap.ContainsKey(typeof(key));
        //} 
    }
}
