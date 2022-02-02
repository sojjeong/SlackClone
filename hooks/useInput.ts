import { useCallback, useState, Dispatch, SetStateAction, UIEvent, ChangeEvent } from 'react';

// return 타입을 변수로 설정
type ReturnTypes<T = any> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

// 커스텀 hook : 기존의 hook들을 하나로 합쳐서 새로운 hook을 만들어 내는 것
const useInput = <T>(initialData: T): ReturnTypes<T> => {
  // generic으로 선언
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);

  // 위의 두 hook을 합쳐 한번에 값을 반환
  return [value, handler, setValue];
};

export default useInput;
