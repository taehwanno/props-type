# props-type [![npm version](https://badge.fury.io/js/props-type.svg)](https://badge.fury.io/js/props-type) ![github actions](https://github.com/taehwanno/props-type/workflows/Node%20CI/badge.svg)

Utility type that defines the type of the React component props through `propTypes` and `defaultProps` in TypeScript

**Table of contents**

- [Installation](#installation)
- [Prerequisite](#prerequisite)
- [Usage](#usage)
- [Type Inference](#type-inference)
- [Example](#example)
  - [without `defaultProps`](#without-defaultprops)
  - [with `defaultProps`](#with-defaultprops)
  - [`null` or `undefined` in `defaultProps`](#null-or-undefined-in-defaultprops)
- [Limits](#limits)

## Installation

```shell
# with NPM
$ npm install --save-dev props-type

# with Yarn
$ yarn add --dev props-type
```

## Prerequisite

- `typescript` >= 2.8 (recommend 3.0+ because of [support for `defaultProps` in JSX](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#support-for-defaultprops-in-jsx))
- `@types/prop-types` >= 15.5.4

## Usage

```tsx
import PropsType from 'props-type';

// Without defaultProps
type Props = PropsType<typeof propTypes>;

// With defaultProps
type Props = PropsType<typeof propTypes, typeof defaultProps>;
```

## Type Inference

### Optional (without `isRequired`)

#### without `defaultProps`

```tsx
const propTypes = { disabled: PropTypes.bool };
type Props = PropsType<typeof propTypes>;
```

- Internal : `Props` type is `disabled: boolean | null | undefined`
- External : `<Button disabled?: boolean | null | undefined />`

#### with `defaultProps`

```tsx
const propTypes = { disabled: PropTypes.bool };
const defaultProps = { disabled: false };
type Props = PropsType<typeof propTypes, typeof defaultProps>;
```

- Internal : `Props` type is `boolean`
- External : `<Button disabled?: boolean | undefined />`

### Required (with `isRequired`)

#### without `defaultProps`

```tsx
const propTypes = { disabled: PropTypes.bool.isRequired };
type Props = PropsType<typeof propTypes>;
```

- Internal : `Props` type is `disabled: boolean`
- External : `<Button disabled: boolean />`

#### with `defaultProps`

```tsx
const propTypes = { disabled: PropTypes.bool.isRequired };
const defaultProps = { disabled: false };
type Props = PropsType<typeof propTypes, typeof defaultProps>;
```

- Internal : `Props` type is `disabled: boolean`
- External : `<Button disabled?: boolean | undefined />`

## Example

### without `defaultProps`

#### External

```tsx
const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func,
};

type ButtonProps = PropsType<typeof propTypes>;
```

```tsx
// Correct
<Button disabled onClick={onClick} />
<Button className="primary" disabled onClick={onClick} />
<Button disabled onClick={onClick} onDoubleClick={onDoubleClick} />
<Button className="primary" disabled onClick={onClick} onDoubleClick={onDoubleClick} />

// Invalid
<Button /> // Property 'disabled' and 'onClick' is missing
<Button disabled /> // Property 'onClick' is missing
<Button onClick /> // Property 'disabled' is missing
```

- required : `disabled`, `onClick`
- optional : `className`, `onDoubleClick`

#### Internal

```tsx
function Button({ className, disabled, onClick, onDoubleClick }: ButtonProps) {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    />
  );
}

Button.propTypes = propTypes;
```

- `className` type : `string | null | undefined`
- `disabled` type : `boolean`
- `onClick` type : `((...args: any[]) => any)`
- `onDoubleClick` type : `((...args: any[]) => any) | null | undefined`

### with `defaultProps`

#### External

```tsx
const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func,
};

const defaultProps = {
  className: 'primary',
  onDoubleClick(event: React.MouseEvent<HTMLButtonElement>) {},
};

type ButtonProps = PropsType<typeof propTypes>;
```

```tsx
// Correct
<Button disabled onClick={onClick} />
<Button className="secondary" disabled onClick={onClick} />
<Button disabled onClick={onClick} onDoubleClick={(event: React.MouseEvent<HTMLButtonElement>) => {}} />
<Button className="secondary" disabled onClick={onClick} onDoubleClick={(event: React.MouseEvent<HTMLButtonElement>) => {}} />

// Invalid
<Button /> // Property 'disabled' and 'onClick' is missing
<Button disabled /> // Property 'onClick' is missing
<Button onClick={onClick} /> // Property 'disabled' is missing
<Button disabled onClick={onClick} onDoubleClick={(a: number) => {}} /> // Type '(a: number) => void' is not assignable to type '(event: MouseEvent<HTMLButtonElement, MouseEvent>) => void'
```

- required : `disabled`, `onClick`
- optional : `className`, `onDoubleClick`

#### Internal

```tsx
function Button({ className, disabled, onClick, onDoubleClick }: ButtonProps) {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    />
  );
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
```

- `className` type : `string`
- `disabled` type : `boolean`
- `onClick` type : `((...args: any[]) => any)`
- `onDoubleClick` type : `(event: React.MouseEvent<HTMLButtonElement>) => void`

### `null` or `undefined` in `defaultProps`

#### External

```tsx
const propTypes = {
  className: PropTypes.string,
  testId: PropTypes.string,
};

const defaultProps = {
  className: null,
  testId: undefined,
};

type ButtonProps = PropsType<typeof propTypes, typeof defaultProps>;
```

```tsx
// Correct
<Button />
<Button className={null} />
<Button testId={undefined} />

// Incorrect
<Button className={undefined} />
<Button testId={null} />
```

- required : N/A
- optional : `className`, `testId`

#### Internal

```tsx
function Button({ className, testId }: ButtonProps) {
  return <button className={className} data-testid={testId} />;
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
```

- `className` type : `string | null`
- `testId` type : `string | undefined`

## Limits

The prop type of `oneOf` in `prop-types` is not inferenced to union type.

```tsx
const propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

const defaultProps = {
  type: 'button',
};

type ButtonProps = PropsType<typeof propTypes, typeof defaultProps>;

function Button({ type }: ButtonProps) {
  return <button type={type}>Button</button>; // Type 'string | null | undefined' is not assignable to type '"button" | "submit" | "reset" | undefined'.
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
```

`type` prop is inferenced to `string` (not a `'button' | 'submit' | 'reset'` union type) because `prop-types` typescript type declaration currently have problems related to `InferProps` type (in `@types/prop-types`). If you want to inference `oneOf` as union type, this workaround can help you.

```tsx
type ButtonProps = PropsType<typeof propTypes, typeof defaultProps> & {
  type: 'button' | 'submit' | 'reset';
};
```

## Thanks

This package is inspired by [Brie Bunge](https://github.com/brieb) in [Adopting TypeScript at Scale, JSConf Hawaii 2019](https://www.youtube.com/watch?v=P-J9Eg7hJwE&feature=youtu.be&t=1063)

## License

MIT © [Taehwan Noh](https://github.com/taehwanno)
