import { ContentBlock } from "../../components/ContentBlock";
import { Layout } from "../../components/Layout";
import type { BucketList, List } from "../../types";

interface Props {
  bucketList: List<BucketList>;
}
export const BucketListPage = ({ bucketList }: Props) => {
  return (
    <Layout>
      <div className="post-page-header_container">
        <h1>{bucketList.name}</h1>
        <h2>{bucketList.description}</h2>
      </div>
      <article className="list-bucket-list">
        {bucketList.list.map(({ category, tasks }) => (
          <div key={category}>
            <h3>{category}</h3>
            <ul>
              {tasks.map((task, i) => (
                <li key={i}>
                  {task.value.map((block, j) =>
                    task.isDone ? (
                      <div key={j}>
                        <s>
                          <ContentBlock block={block} />
                        </s>
                        <span>{task.doneDate ? `${task.doneDate}` : null}</span>
                      </div>
                    ) : (
                      <ContentBlock block={block} key={j} />
                    ),
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </article>
    </Layout>
  );
};
