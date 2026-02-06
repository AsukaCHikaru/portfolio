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
      <article className="list-video-game-index">
        {bucketList.list.map(({ category, tasks }) => (
          <div key={category}>
            <h3>{category}</h3>
            <ul>
              {tasks.map((task) => (
                <li key={task.value}>{task.value}</li>
              ))}
            </ul>
          </div>
        ))}
      </article>
    </Layout>
  );
};
