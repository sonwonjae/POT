const router = require('express').Router();
const { getBoardData, patchCompletedBoardData, getBoardList, setBoard } = require('../query/boardsQuery');

router.get('/list', (req, res) => {
  const { currentPageNo, recordsPerPage } = req.query;
  const boards = getBoardList(+currentPageNo, +recordsPerPage);

  res.send(boards);
});

router.get('/detail/:id', (req, res) => {
  console.log('hi detail');
  console.log(req.query);
});

router.post('/', (req, res) => {
  // TODO: 포지션 이름 상수로 빼기
  const position = { top: false, jug: false, mid: false, adc: false, sup: false };
  const checkedPosition = [...req.body.position];
  for (const name of Object.keys(position)) {
    position[name] = checkedPosition.includes(name);
  }

  // TODO: id받기
  const board = {
    userId: 1,
    type: req.body.type,
    title: req.body.title,
    content: req.body.content,
    position,
  };
  try {
    const boardId = setBoard(board);
    // window.location.assign(window.location.host + `/boards/${boardId}`);
    // window.location.assign('www.naver.com');
    // res.status(200).redirect(`/api/detail/${boardId}`);
    res.status(200).send(boardId + '');
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/manage/:id', (req, res) => {
  const boardId = req.path.replace('/manage/', '');
  const { title, position } = getBoardData(boardId);
  res.send({ title, position });
});

router.patch('/participant/:id', (req, res) => {
  const {
    body: { completed },
    path,
  } = req;
  const [boardId, userId] = path.replace('/participant/', '').split('=');
  patchCompletedBoardData(boardId, userId, completed);
  res.send();
});
module.exports = router;
