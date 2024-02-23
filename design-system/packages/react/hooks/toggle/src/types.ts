export type ToggleProps = {
  isSelected?: boolean;
};

export interface UseToggleReturn {
  readonly isSelected: boolean;
  setSelected(isSelected: boolean): void;
  //값을 set할 수 있는 setSelected
  toggle(): void;
  //toggle함수를 호출하면 그 전에 반대값으로 변경
}
