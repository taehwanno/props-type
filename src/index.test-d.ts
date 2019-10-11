import * as React from 'react';
import * as PropTypes from 'prop-types';
import { expectType } from 'tsd';

import PropsType from './';

/**
 * Fixtures
 */

const propTypes = {
  bool: PropTypes.bool,
  string: PropTypes.string,
  func: PropTypes.func,
  null: PropTypes.bool,
  undefined: PropTypes.bool,
  boolIsRequired: PropTypes.bool.isRequired,
  stringIsRequired: PropTypes.string.isRequired,
  funcIsRequired: PropTypes.func.isRequired,
};

const defaultProps = {
  bool: false,
  string: '',
  null: null,
  undefined: undefined,
  func(event: React.MouseEvent<HTMLButtonElement>) {}, // eslint-disable-line @typescript-eslint/no-unused-vars
};

type PropsWithoutDefaultProps = PropsType<typeof propTypes>;
type PropsWithDefaultProps = PropsType<typeof propTypes, typeof defaultProps>;

declare const props1: PropsWithoutDefaultProps;
declare const props2: PropsWithDefaultProps;

/**
 * Tests
 */

{
  // Props without defaultProps
  // Optional
  expectType<boolean | null | undefined>(props1.bool);
  expectType<string | null | undefined>(props1.string);
  expectType<((...args: any[]) => any) | null | undefined>(props1.func);
  expectType<boolean | null | undefined>(props1.null);
  expectType<boolean | null | undefined>(props1.undefined);

  // Non-Optional (isRequired)
  expectType<boolean>(props1.boolIsRequired);
  expectType<string>(props1.stringIsRequired);
  expectType<(...args: any[]) => any>(props1.funcIsRequired);
}

{
  // Props with defaultProps
  // Optional
  expectType<boolean>(props2.bool);
  expectType<string>(props2.string);
  expectType<(event: React.MouseEvent<HTMLButtonElement>) => void>(props2.func);
  expectType<boolean | null>(props2.null);
  expectType<boolean | undefined>(props2.undefined);

  // Non-Optional (isRequired)
  expectType<boolean>(props2.boolIsRequired);
  expectType<string>(props2.stringIsRequired);
  expectType<(event: React.MouseEvent<HTMLButtonElement>) => void>(props2.funcIsRequired);
}
