import { Suspense, lazy } from "react";

import ErrorBoundary from "@/components/customs/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";

import { useFetch } from "@/hooks/use-fetch";

import { type IPlotlyElement } from "@/types/element";

const Plot = lazy(() => import("react-plotly.js"));

interface Props {
  element: IPlotlyElement;
}

const _PlotlyElement = ({ element }: Props) => {
  const { data, error, isLoading } = useFetch(element.url || null);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>An error occurred</div>;
  }

  let state;

  if (data) {
    state = data;
  } else {
    return null;
  }

  return (
    <Suspense fallback={<Skeleton className="h-full rounded-md" />}>
      <Plot
        className={`${element.display}-plotly`}
        data={state.data}
        layout={state.layout}
        frames={state.frames}
        config={state.config}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
        useResizeHandler={true}
      />
    </Suspense>
  );
};

const PlotlyElement = (props: Props) => {
  return (
    // prefix="Failed to load chart."
    <ErrorBoundary>
      <_PlotlyElement {...props} />
    </ErrorBoundary>
  );
};

export { PlotlyElement };
