# props-type

Utility type that defines the type of the React component props through `propTypes` and `defaultProps` in TypeScript

## Installation

```shell
# with NPM
$ npm install --save-dev props-type

# with Yarn
$ yarn add --dev props-type
```

## Prerequisite

- `typescript` >= 2.8
- `prop-types` >= 15.5.4

## Usage

```tsx
import PropsType from 'props-type';

// Without defaultProps
type Props = PropsType<typeof propTypes>;

// With defaultProps
type Props = PropsType<typeof propTypes, typeof defaultProps>;
```

## License

MIT © [Taehwan Noh](https://github.com/taehwanno)
