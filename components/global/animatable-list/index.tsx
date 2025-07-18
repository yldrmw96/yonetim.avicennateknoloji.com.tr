import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';
import { TransitionGroup } from 'react-transition-group';

type PolymorphicAsProp<E extends ElementType> = {
  as?: E;
};

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & PolymorphicAsProp<E>
>;

const defaultElement = 'div';

type AnimatableListProps<E extends ElementType = typeof defaultElement> =
  PolymorphicProps<E> & {
    color?: 'primary' | 'secondary';
  };

function AnimatableList<E extends ElementType = typeof defaultElement>({
  as,
  children,
  color = 'primary',
  className,
  ...restProps
}: AnimatableListProps<E>) {
  const Component = as ?? defaultElement;

  const defaultClassName = 'some-custom-class-name';
  const transitionDefaultClassName = 'transition-default';
  return (
    <Component {...restProps} className={className + ' ' + defaultClassName}>
      <TransitionGroup className={transitionDefaultClassName}>
      {children}
    </TransitionGroup>
    </Component>
  );
}

export default AnimatableList;