import { useCallback, useState, Dispatch, SetStateAction } from 'react';

// 커스텀 hook : 기존의 hook들을 하나로 합쳐서 새로운 hook을 만들어 내는 것
const useInput = <T = any>(initialData: T): [T, (e: any) => void, Dispatch<SetStateAction<T>>] => {
  // generic으로 선언
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  // 위의 두 hook을 합쳐 한번에 값을 반환
  return [value, handler, setValue];
};

export default useInput;
