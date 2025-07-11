import { useEffect } from "react";
import { useWindowSize } from "@app/utils/hooks/useWindowSize";
import { calculateWindowSize } from "@app/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setWindowSize } from "@app/store/reducers/ui";

import RenderRoute from "@app/routes/RenderRoute";
import Loading from "@app/components/loader/Loading";
const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useSelector((state) => state.ui.screenSize);
  const loading = useSelector((state) => state.loadingSlice.loading);
 
  const dispatch = useDispatch();

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);
  return (
    <>
      {loading && <Loading />}
      <RenderRoute />
    </>
  );
};

export default App;
