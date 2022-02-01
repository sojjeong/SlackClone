import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';
import useSWR from 'swr';

import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { Label, Form, Input, LinkContainer, Button, Header, Error } from './styles';

const Login = () => {
  // swr 의 좋은점 : 로딩중임을 알 수 있음. data 가 없으면 로딩중
  // fetcher가 리턴하는 데이터를 담아줌
  // dedupingInterval 옵션 사용: 주기적으로 호출은 하지만 deduping 기간 내에서는 캐시에서 불러옴
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          'http://localhost:3095/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          // 성공하면 fetcher 실행
          // mutate(response.data, true); // optimistic ui
          mutate();
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password, mutate],
  );

  if (!error && data) {
    // data 가 다 불러와지면 Redirect
    console.log('login에서 호출하는 리다이렉트');
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

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
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Login;
