import React, { Suspense, lazy } from "react";

type Loader = () => Promise<any>;

type DynamicOptions = {
  loading?: React.ComponentType<any>;
  ssr?: boolean;
};

export default function dynamic(loader: Loader, options: DynamicOptions = {}) {
  const LazyComponent = lazy(async () => {
    const mod = await loader();
    return { default: mod.default || mod };
  });

  const Loading = options.loading;

  return function DynamicComponent(props: any) {
    return (
      <Suspense fallback={Loading ? <Loading {...props} /> : null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
