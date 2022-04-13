export const IotsAPI = {
  types: () =>
    http('api/iot/types')
      .method('get'),

  search: (title) =>
    http('api/iot/search')
      .method('get')
      .query({ title }),

  create: (type, title, hello, min, max) =>
    http('api/iot/create')
      .method('post')
      .body({
        type,
        title,
        hello,
        min,
        max
      }),

  update: (iotId, iotData) =>
    http('api/iot/update')
      .method('put')
      .query({ iotId })
      .body(iotData),

  delete: (iotId) =>
    http('api/iot/delete')
      .method('delete')
      .query({ iotId }),

  ownerSet: (iotId) =>
    http('api/iot/owner/set')
      .method('post')
      .query({ iotId }),

  ownerDelete: (iotId) =>
    http('api/iot/owner/delete')
      .method('delete')
      .query({ iotId })
}
