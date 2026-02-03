import styles from './styles.module.scss';

interface PropType {
  content: string;
}

const RenderHtmlContent = (props: PropType) => {
  const { content } = props;

  return <div className={styles.editorContent} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default RenderHtmlContent;
