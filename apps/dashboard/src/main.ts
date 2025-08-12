import { setRemoteDefinitions } from '@nx/angular/mf';

function loadApp() {
  return fetch('/module-federation.manifest.json')
    .then((res) => res.json())
    .then((definitions) => setRemoteDefinitions(definitions))
    .then(() => import('./bootstrap'))
    .catch((err) => {
      const isChunkLoadError = err?.message?.includes('Loading chunk') || err?.name === 'ChunkLoadError';

      if (isChunkLoadError) {
        console.warn('Chunk load error detected. Reloading page...');
        // Only reload once
        const hasReloaded = sessionStorage.getItem('chunkLoadErrorReloaded');
        if (!hasReloaded) {
          sessionStorage.setItem('chunkLoadErrorReloaded', 'true');
          window.location.reload();
        } else {
          console.error('Already reloaded once. Avoiding reload loop.');
        }
      } else {
        console.error('App bootstrap error:', err);
      }
    });
}

loadApp();
