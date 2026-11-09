// Mirrors how consumers (e.g. nectar-blocks) use the package. Compile-only.
import { lazy, Suspense, useRef } from 'react';
import type { ComponentProps, ComponentType } from 'react';
import ReactGPickerDefault, {
  DEFAULT_COLORS,
  ReactGPicker
} from 'react-gcolor-picker-2';
import type {
  ColorFormat,
  IPropsMain,
  ReactGPickerHandle,
  ReactGPickerProps,
  TabValue
} from 'react-gcolor-picker-2';

// Props can be derived from the component type.
type Props = ComponentProps<typeof ReactGPicker>;
const props: Props = { value: '#fff', onChange: (value: string) => void value };
const legacy: IPropsMain = props;
const format: ColorFormat = 'hex';
const tab: TabValue = 'gradient';

// It is a regular component type.
const asComponent: ComponentType<ReactGPickerProps> = ReactGPicker;

// Lazy-loading the default export needs no `.then()` remapping or casts.
const LazyPicker = lazy(() => import('react-gcolor-picker-2'));

export const Example = () => {
  const ref = useRef<ReactGPickerHandle>(null);
  return (
    <>
      <ReactGPicker
        ref={ref}
        {...legacy}
        format={format}
        defaultActiveTab={tab}
        defaultColors={DEFAULT_COLORS}
        popupWidth='100%'
      />
      <ReactGPickerDefault value='' onChangeTabs={(t: string) => void t} />
      <Suspense fallback={null}>
        <LazyPicker ref={ref} value='#000' gradient />
      </Suspense>
      <button
        type='button'
        onClick={() => ref.current?.applyColor('#ff0000')}
      />
    </>
  );
};

// @ts-expect-error -- unsupported format
export const bad: ReactGPickerProps = { format: 'cmyk' };
export { asComponent };
