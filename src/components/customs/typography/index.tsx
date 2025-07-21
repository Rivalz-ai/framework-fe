import Display from './display';
import Text from './text';

interface TypographyProps {
  Display: typeof Display;
  Text: typeof Text;
}

const Typography: TypographyProps = {
  Display,
  Text,
};

export default Typography;
