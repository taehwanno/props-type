import * as PropTypes from 'prop-types';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type Function = (...args: any[]) => any;

type PickDefaultPropIfFunctionProp<PV, DV = Function> = PV extends Function ? DV : PV;

/**
 * Get the type that represents the props with the defaultProps included.
 */
type WithDefaultProps<P, DP> = Omit<P, keyof DP> &
  {
    [K in Extract<keyof DP, keyof P>]: DP[K] extends NonNullable<P[K]>
      ? PickDefaultPropIfFunctionProp<NonNullable<P[K]>, DP[K]>
      : NonNullable<P[K]> | DP[K];
  };

/**
 * Get the props type from propTypes and defaultProps.
 * @example
 * // Without defaultProps
 * type Props = PropsType<typeof propTypes>;
 *
 * // With defaultProps
 * type Props = PropsType<typeof propTypes, typeof defaultProps>;
 */
type PropsType<PT, DP = {}> = WithDefaultProps<PropTypes.InferProps<PT>, DP>;

export default PropsType;
