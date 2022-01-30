import React, { useCallback, useState } from 'react';
import { Label, Form, Input, LinkContainer, Button, Header, Error } from './styles';
import useInput from '@hooks/useInput';

const SignUp = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');

  // 구조적 할당에 의해 사용하지 않을 변수는 빈칸으로 둬서 받음
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);

  // 커스텀 hook 사용으로 더 이상 필요 없음!
  // const onChangeEmail = useCallback((e) => {
  //   setEmail(e.target.value);
  // }, []);

  // const onChangeNickname = useCallback((e) => {
  //   setNickname(e.target.value);
  // }, []);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      // useCallback : 이 함수를 기억해둬라(캐싱해둬라), deps에 있는 값이 하나라도 바뀔때까지
      // deps 의 값이 바뀌면 함수를 새로 만들고, 값이 바뀌지 않으면 이전 함수를 계속 사용
      // useCallback으로 안감싸줘도 되지만, 리렌더링이 많이 일어남(사실 성능저하에 큰 영향을 미치는건 아니지만..)
      e.preventDefault();

      if (!missmatchError) {
        console.log('서버로 가입 정보 전송');
      }
    },
    [email, nickname, password, passwordCheck], // deps
  );

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input type="password" id="password-check" name="password-check" value={passwordCheck} onChange={onChangePasswordCheck} />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>이미 가입된 이메일입니다.</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
