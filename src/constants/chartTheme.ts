export const chartConfig = (
  colors: ReactNativePaper.ThemeColors,
  dark?: boolean,
) => ({
  backgroundColor: colors.surface,
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 2, // optional, defaults to 2dp
  color: () => (dark ? colors.success : colors.backdrop),
  labelColor: () => colors.text,
  style: {borderRadius: 16},
  strokeWidth: '1',
  propsForDots: {
    r: '4',
    strokeWidth: '1',
    stroke: dark ? colors.success : colors.backdrop,
  },
});
