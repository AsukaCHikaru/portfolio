import { Layout } from "../../components/Layout";
import type {
  List,
  MusicAwardList,
  MusicAwardNominee,
  RecordNominee,
} from "../../types";

const isRecordNominee = (
  nominee: MusicAwardNominee,
): nominee is RecordNominee => "title" in nominee;

interface Props {
  musicAwards: List<MusicAwardList>;
}
export const MusicAwardsListPage = ({ musicAwards }: Props) => {
  return (
    <Layout>
      <div className="post-page-header_container">
        <h1>{musicAwards.name}</h1>
        <h2>{musicAwards.description}</h2>
      </div>
      <article className="list-music-awards">
        <ul>
          {musicAwards.list.map(({ year, categories }) => (
            <li key={year}>
              <h3>{year}</h3>
              {categories.map(({ category, nominees }) => (
                <div
                  key={`${year}-${category}`}
                  className="list-music-awards-category"
                >
                  <h4>{category}</h4>
                  {nominees.map((nominee, i) => (
                    <Nominee
                      nominee={nominee}
                      key={`${year}-${category}-${nominee.artist}-${i}`}
                    />
                  ))}
                  <div className="list-music-awards-category-divider" />
                </div>
              ))}
            </li>
          ))}
        </ul>
      </article>
    </Layout>
  );
};

const Nominee = ({ nominee }: { nominee: MusicAwardNominee }) => {
  if (nominee.isWinner)
    return isRecordNominee(nominee) ? (
      <div className="list-music-awards-winner">
        <p>
          {"\u201C"}
          {nominee.title}
          {"\u201D"}
        </p>
        <p>
          {nominee.artist}
          {nominee.feat ? ` ${nominee.feat}` : ""}
        </p>
      </div>
    ) : (
      <div className="list-music-awards-winner">
        <p>{nominee.artist}</p>
      </div>
    );

  return isRecordNominee(nominee) ? (
    <div className="list-music-awards-nominee">
      <span>・</span>
      <p>{`"${nominee.title}"`}</p>
      <span>-</span>
      <p>
        {nominee.artist}
        {nominee.feat ? ` ${nominee.feat}` : ""}
      </p>
    </div>
  ) : (
    <div className="list-music-awards-nominee">
      <span>・</span>
      <p>{nominee.artist}</p>
    </div>
  );
};
