import { ContentBlock } from "../../components/ContentBlock";
import { Helmet } from "../../components/Helmet";
import { Layout } from "../../components/Layout";
import type { BucketList, BucketListData, List } from "../../types";
import { useSiteData } from "../../components/SiteDataStore";

export const BucketListPage = () => {
  const siteData = useSiteData<BucketListData>("/list/bucket-list");
  if (!siteData) return null;
  return <BucketListPageContent bucketList={siteData.data.bucketList} />;
};

interface Props {
  bucketList: List<BucketList>;
}
export const BucketListPageContent = ({ bucketList }: Props) => {
  return (
    <>
      <Helmet title={bucketList.name} description={bucketList.description} />
      <Layout>
        <div className="post-page-header_container">
          <h1>{bucketList.name}</h1>
          <h2>{bucketList.description}</h2>
        </div>
        <article className="list list-bucket-list">
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
                          <span>
                            {task.doneDate ? `${task.doneDate}` : null}
                          </span>
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
    </>
  );
};
