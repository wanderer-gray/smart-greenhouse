export const MetricAPI = {
  searchIot: (iotId, begin, end) =>
    http('api/metric/iot/search')
      .method('get')
      .query({
        iotId,
        begin,
        end
      }),

  searchGroup: (groupId, begin, end) =>
    http('api/metric/group/search')
      .method('get')
      .query({
        groupId,
        begin,
        end
      }),

  add: (iotId, value) =>
    http('metric/add')
      .method('post')
      .query({
        iotId,
        value
      })
}
