export const EventAPI = {
  searchIot: (iotId, begin, end) =>
    http('api/event/iot/search')
      .method('get')
      .query({
        iotId,
        begin,
        end
      }),

  searchGroup: (groupId, begin, end) =>
    http('api/event/group/search')
      .method('get')
      .query({
        groupId,
        begin,
        end
      })
}
