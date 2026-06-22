# interactive-translator
**a html translator that translates every sentence in realtime, using chrome Language model**

一个简单的纯前端句子翻译器，使用从chrome v148开始内置的Gemini Nano来对输入的每一个中文句子进行自动翻译。对每个句子提供3种不同风格的翻译。主要用于英语写作练习目的。
- 指针停留在句子上会自动显示相关翻译
- 默认以"。"句号作为每个句子的分隔点，支持直接在界面内添加/修改句子的分割方式(指针选择相关分割符号上)
- 桌面窗口式设计，支持自由改变翻译器窗口的大小和位置(指针在窗口右下/左上角的控件拖动)
- 窗口下半部分带有一个辅助翻译器，以列表形式存储，负责备用/测试翻译
- 数据保存在本地
- 一个自制动态背景
<img width="1910" height="929" alt="Screenshot" src="https://github.com/user-attachments/assets/bc8258b9-3875-4ae2-be9a-3185385f6cab" />

需要在PC chrome v148及以上版本的Google Chrome上运行,初次运行可能需要下载Gemini Nano模型文件(3~4GB，一般浏览器已经自动下载)

