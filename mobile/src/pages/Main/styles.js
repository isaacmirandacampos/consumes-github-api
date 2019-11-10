import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  padding: 30px;
`;
export const Form = styled.View`
  flex-direction: row;
  border-color: #eee;
  padding-bottom: 20px;
  border-bottom-width: 1px;
`;

export const Input = styled.TextInput.attrs({
  placehoulderTextColor: '#999',
})`
  flex: 1;
  height: 40px;
  background: #eee;
  border-radius: 4px;
  padding: 0 15px;
  border: 1px solid #eee;
`;

export const SubmitButton = styled(RectButton)`
  justify-content: center;
  align-items: center;
  background: #7159c1;
  margin-left: 10px;
  border-radius: 4px;
  padding: 0 12px;
`;
