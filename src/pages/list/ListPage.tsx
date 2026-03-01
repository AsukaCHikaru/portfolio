import { Layout } from "../../components/Layout";
import { Link } from "../../components/Link";
import { Helmet } from "../../components/Helmet";
import { useSiteData } from "../../components/SiteDataStore";

export const ListPage = () => {
  const siteData = useSiteData({ path: "/list" });

  if (!siteData) {
    return null;
  }

  const { musicAwards, videoGameIndex, bucketList } = siteData.data;

  return (
    <>
      <Helmet title="List | Asuka Wang" description="Asuka Wang's lists" />
      <Layout>
        <h1 className="list-page-header">List</h1>
        <div className="list-page-list">
          <ul>
            <li>
              <Link to={`/list/${musicAwards.pathname}`}>
                <h3>{musicAwards.name}</h3>
                <p>{musicAwards.description}</p>
              </Link>
            </li>
            <li>
              <Link to={`/list/${videoGameIndex.pathname}`}>
                <h3>{videoGameIndex.name}</h3>
                <p>{videoGameIndex.description}</p>
              </Link>
            </li>
            <li>
              <Link to={`/list/${bucketList.pathname}`}>
                <h3>{bucketList.name}</h3>
                <p>{bucketList.description}</p>
              </Link>
            </li>
          </ul>
        </div>
      </Layout>
    </>
  );
};
