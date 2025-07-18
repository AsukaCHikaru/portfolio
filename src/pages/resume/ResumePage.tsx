import { Helmet } from "../../components/Helmet";

export const ResumePage = () => (
  <>
    <Helmet title="Resume | Asuka Wang" description="Asuka Wang's resume " />
    <div className="resume-page_container">
      <p>
        PDFバージョンは
        <a
          href="/asuka-wang_resume_ja.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          こちら
        </a>
      </p>
      <article>
        <section>
          <h1>王 宏貿 (Asuka Wang)</h1>
          <div>
            <ul>
              <li>
                <a href="mailto:asuka@asukawang.com">asuka@asukawang.com</a>
              </li>
              <li>
                <a href="tel:+818039050107">(+81) 80-3905-0107</a>
              </li>
              <li>福岡県福岡市</li>
              <li>
                <a
                  href="https://asukawang.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://asukawang.com
                </a>
              </li>
            </ul>
          </div>
        </section>
        <section>
          <h2>職歴</h2>
          <h3>フロントエンドエンジニア</h3>
          <p>
            LINEヤフー株式会社 <span>— 2023 - 現在</span>
          </p>
          <ul>
            <li>
              大規模リニューアルの担当メンバーとして指定され、Vite Plugin や App
              Router など基盤設定と React
              を用いたコア機能の開発を担当し、スケージュール通りのリリースを達成
            </li>
            <li>
              開発中に遭遇したバグの原因となる OSS
              ライブラリに直接に修正を提出し、OSS 活動と開発業務を同時に達成
            </li>
            <li>
              APP運用のための外部サービスを内製化し、月間150万円以上のコスト削減を達成
            </li>
          </ul>
          <h3>フロントエンドエンジニア</h3>
          <p>
            Line Growth Technology 株式会社 <span>— 2020 - 2023</span>
          </p>
          <ul>
            <li>
              新規事業に立ち上げメンバーとして参加し、Webpack や
              フロント開発用プロキシサーバーなど基盤設定と React / Redux
              を用いたコア機能の開発を担当
            </li>
            <li>
              計測サービスの導入開発作業を独自で担当し、企画・マーケティングなど複数のステークホルダーと効率よくコミュニケーションを行いながら事業部の施策目標を達成
            </li>
          </ul>
          <h3>テスト自動化エンジニア</h3>
          <p>
            Line Fukuoka 株式会社 <span>— 2018 - 2020</span>
          </p>
          <ul>
            <li>プロジェクト内初めての自動化テスト環境を整備</li>
            <li>100個以上の自動化テストケースを作成、保守</li>
          </ul>
        </section>
        <section>
          <h2>スキル</h2>
          <h3>プログラミング言語</h3>
          <ul>
            <li>JavaScript, TypeScript, HTML5/CSS3</li>
          </ul>
          <h3>技術</h3>
          <ul>
            <li>React.js, Node.js, Vite, Vitest, Git, Github Actions</li>
          </ul>
          <h3>言語</h3>
          <ul>
            <li>中国語: Proficient (CEFR-C2)</li>
            <li>日本語: Proficient (CEFR-C1)</li>
            <li>英語: Independent (CEFR-B2)</li>
          </ul>
        </section>
        <section>
          <h2>学歴</h2>
          <p>
            国立台湾師範大学応用電子学部卒業 <span>— 2007 - 2011</span>
          </p>
          <p>台湾台北市</p>
        </section>
      </article>
    </div>
  </>
);
