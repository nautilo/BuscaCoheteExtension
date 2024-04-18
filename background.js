chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [],
  addRules: [
    {
      id: 'block-inappropriate-content',
      action: {
        type: 'block',
      },
      priority: 1,
      condition: {
        urlFilter: {
          regex: '.*\\.(jpg|jpeg|png|gif|bmp|webp|mp4|webm|ogg|avi|wmv|flv|mov)',
        },
      },
    },
  ],
});

console.log('Reglas de bloqueo actualizadas correctamente.');