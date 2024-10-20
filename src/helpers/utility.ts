export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/*
 * Called on every page to have initial skeleton
 * while the page is getting ready to accept inputs
 */
export const initialLoad = async (
  setReady: React.Dispatch<React.SetStateAction<boolean>>
) => {
  await sleep(100);
  setReady(true);
};
