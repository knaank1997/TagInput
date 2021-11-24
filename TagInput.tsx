import './style/tag-input.less';
import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
interface InputTaOrganismProps {
  placeholder?: string;
  value?: any;
  isNotDuplicate?: boolean;
  layout?: string;
  maxLength?: number;
  disabled?: boolean;
  onChange?: Function;
}
export const InputTaOrganism = (props: InputTaOrganismProps) => {
  const [tagsValue, setTagsValue] = useState<any>([]);
  const [text, setText] = useState('');
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTagsValue(props.value || []);
  }, []);

  const removeTag = (index: number) => {
    const tags = tagsValue.filter((_, i: number) => i !== index);
    setTagsValue(tags);

    props.onChange && props.onChange(tagsValue);
    createChangeEvent();
    (inputEl.current as HTMLInputElement).focus();
  };

  const createChangeEvent = () => {
    const e = new Event('change', { bubbles: true, cancelable: true });
    inputEl.current?.dispatchEvent(e);
  };

  const handleKeyEvent = (event: any) => {
    const { keyCode } = event;

    if ([13, 9].includes(keyCode)) {
      addTag(text);
    }

    if (keyCode == 8 && !text) {
      removeTag(tagsValue?.length - 1);
    }
  };

  const addTag = (val: any, focus = true) => {
    const isExist = tagsValue?.some((e: any) => e == val.trim());

    if (
      (!props.isNotDuplicate || (props.isNotDuplicate && !isExist)) &&
      !isEmpty(val.trim())
    ) {
      tagsValue?.push(val);
    }

    setTagsValue(tagsValue);
    props.onChange && props.onChange(tagsValue);

    createChangeEvent();

    setText('');
    focus && (inputEl.current as HTMLInputElement).focus();
  };

  return (
    <div>
      <div className="tag-input">
        {tagsValue?.length > 0 &&
          tagsValue.map((tag: any, index: number) => (
            <div className="tag-input__tag">
              <span className="tag-input__tag-content">{tag}</span>
              <CloseOutlined
                className="tag-input__tag-remove"
                onClick={() => removeTag(index)}
              />
            </div>
          ))}
        <input
          ref={inputEl}
          className="tag-input__text"
          maxLength={props.maxLength}
          placeholder={tagsValue?.length > 0 ? '' : props.placeholder}
          disabled={props.disabled}
          value={text}
          onBlur={(event) => addTag(event.target.value, false)}
          onKeyUp={(event) => handleKeyEvent(event)}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
};
