import dotenvx from '@dotenvx/dotenvx';

//@ts-expect-error: Will be resolved by wrangler build as a Text module
import envSrc from '../.env.production';
//@ts-expect-error: Will be resolved by wrangler build
import {
  handleCdnCgiImageRequest,
  handleImageRequest,
} from '../.open-next/cloudflare/images.js';
//@ts-expect-error: Will be resolved by wrangler build
import { runWithCloudflareRequestContext } from '../.open-next/cloudflare/init.js';
//@ts-expect-error: Will be resolved by wrangler build
import { maybeGetSkewProtectionResponse } from '../.open-next/cloudflare/skew-protection.js';
//@ts-expect-error: Will be resolved by wrangler build
import { handler as middlewareHandler } from '../.open-next/middleware/handler.mjs';
//@ts-expect-error: Will be resolved by wrangler build
export { DOQueueHandler } from '../.open-next/.build/durable-objects/queue.js';
//@ts-expect-error: Will be resolved by wrangler build
export { DOShardedTagCache } from '../.open-next/.build/durable-objects/sharded-tag-cache.js';
//@ts-expect-error: Will be resolved by wrangler build
export { BucketCachePurge } from '../.open-next/.build/durable-objects/bucket-cache-purge.js';

let dotenvInjected = false;

function injectDotenv() {
  if (dotenvInjected) return;
  dotenvInjected = true;
  try {
    dotenvx.config({
      envs: [
        {
          type: 'env',
          value: envSrc,
          privateKeyName: 'DOTENV_PRIVATE_KEY_PRODUCTION',
        },
      ],
    });
  } catch {
    // Decryption is best-effort; secrets not injected here can still be
    // provided as plain Cloudflare bindings.
  }
}

export default {
  async fetch(request, env, ctx) {
    return runWithCloudflareRequestContext(request, env, ctx, async () => {
      injectDotenv();

      const response = maybeGetSkewProtectionResponse(request);
      if (response) {
        return response;
      }

      const url = new URL(request.url);
      // Serve images in development.
      // Note: "/cdn-cgi/image/..." requests do not reach production workers.
      if (url.pathname.startsWith('/cdn-cgi/image/')) {
        return handleCdnCgiImageRequest(url, env);
      }
      // Fallback for the Next default image loader.
      if (
        url.pathname ===
        `${globalThis.__NEXT_BASE_PATH__}/_next/image${globalThis.__TRAILING_SLASH__ ? '/' : ''}`
      ) {
        return await handleImageRequest(url, request.headers, env);
      }
      // - `Request`s are handled by the Next server
      const reqOrResp = await middlewareHandler(request, env, ctx);
      if (reqOrResp instanceof Response) {
        return reqOrResp;
      }
      //@ts-expect-error: resolved by wrangler build
      const { handler } =
        await import('../.open-next/server-functions/default/handler.mjs');
      return handler(reqOrResp, env, ctx, request.signal);
    });
  },
};
