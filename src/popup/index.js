import { createNamespace, isDef } from '../utils';
import { PopupMixin } from '../mixins/popup';
import Icon from '../icon';

const [createComponent, bem] = createNamespace('popup');

export default createComponent({
  // 弹出层公共逻辑
  mixins: [PopupMixin()],

  props: {
    // 是否圆角
    round: Boolean,
    // 动画时间
    duration: [Number, String],
    closeable: Boolean,
    // 自定义动画
    transition: String,
    // iphonex 兼容样式
    safeAreaInsetBottom: Boolean,
    closeIcon: {
      type: String,
      default: 'cross',
    },
    closeIconPosition: {
      type: String,
      default: 'top-right',
    },
    // 弹出位置,定位属性
    position: {
      type: String,
      default: 'center',
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
  },

  beforeCreate() {
    const createEmitter = (eventName) => (event) =>
      this.$emit(eventName, event);

    this.onClick = createEmitter('click');
    this.onOpened = createEmitter('opened');
    this.onClosed = createEmitter('closed');
  },

  methods: {
    onClickCloseIcon(event) {
      this.$emit('click-close-icon', event);
      this.close();
    },
  },

  render() {
    if (!this.shouldRender) {
      return;
    }

    const { round, position, duration } = this;
    const isCenter = position === 'center';

    const transitionName =
      this.transition ||
      (isCenter ? 'van-fade' : `van-popup-slide-${position}`);

    const style = {};
    if (isDef(duration)) {
      const key = isCenter ? 'animationDuration' : 'transitionDuration';
      style[key] = `${duration}s`;
    }

    return (
      <transition
        appear={this.transitionAppear}
        name={transitionName}
        onAfterEnter={this.onOpened}
        onAfterLeave={this.onClosed}
      >
        <div
          vShow={this.value}
          style={style}
          class={bem({
            round,
            [position]: position,
            'safe-area-inset-bottom': this.safeAreaInsetBottom,
          })}
          onClick={this.onClick}
        >
          {this.slots()}
          {this.closeable && (
            <Icon
              role="button"
              tabindex="0"
              name={this.closeIcon}
              class={bem('close-icon', this.closeIconPosition)}
              onClick={this.onClickCloseIcon}
            />
          )}
        </div>
      </transition>
    );
  },
});
