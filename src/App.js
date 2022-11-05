import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import * as consts from "./constants";
import { Col, Row, Spin  } from 'antd';
import { AudioOutlined, VideoCameraOutlined } from '@ant-design/icons';
import ReactAudioPlayer from 'react-audio-player';

const dataInit = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: []
}

const listLevels = [
  {
    code: consts.LEVEL_1,
    name: '1'
  },
  {
    code: consts.LEVEL_2,
    name: '2'
  },
  {
    code: consts.LEVEL_3,
    name: '3' 
  },
  {
    code: consts.LEVEL_4,
    name: '4'
  },
  {
    code: consts.LEVEL_5,
    name: '5'
  },
  {
    code: consts.LEVEL_6,
    name: '6'
  },
  {
    code: consts.LEVEL_7,
    name: '7'
  }
]
const pageSize = 20;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function App() {
  const [data, setData] = useState({
    [consts.LEVEL_1]: require('./videodata/1.json'),
    [consts.LEVEL_2]: require('./videodata/2.json'),
    [consts.LEVEL_3]: require('./videodata/3.json'),
    [consts.LEVEL_4]: require('./videodata/4.json'),
    [consts.LEVEL_5]: require('./videodata/5.json'),
    [consts.LEVEL_6]: require('./videodata/6.json'),
    [consts.LEVEL_7]: require('./videodata/7.json'),
  });
  const [filters, setFilters] = useState({
    page: 1,
    hasMore: true,
    loading: false,
    levels: [
      consts.LEVEL_1
    ]
  });
  const [items, setItems] = useState([]);
  const [video, setVideo] = useState(null);
  const {
    loading,
    hasMore,
    levels,
    page 
  } = filters;
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      loading: true,
    }))
    sleep(50000)
    if (!page) return;
    let itemsTemp = [];
      if (Array.isArray(levels)) {
        levels.forEach((item, index) => {
          itemsTemp = [
            ...itemsTemp,
            ...data[item].map(item1 => ({
              ...item1,
              level: item
            }))
          ]
        })
      }
      // itemsTemp = itemsTemp.sort((a, b) => {
      //   return a.title.localeCompare(b.title)
      // })
    if (page === 1) {
      setItems(itemsTemp.slice((page - 1) * pageSize, page * pageSize));
    } else {
      setItems(prev => ([
        ...prev,
        ...itemsTemp.slice((page - 1) * pageSize, page * pageSize)
      ]));
    }
    setFilters(prev => ({
      ...prev,
      loading: false,
    }))
  }, [page, levels])

  const observer = useRef()
  const lastElRef = useCallback(node => {
    const {
      hasMore,
      page 
    } = filters;
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setFilters(prev => ({
          ...prev,
          page: prev.page + 1,
        }))
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const getStyleByLevel = (level) => {
    let styles = {
      width: 24,
      height: 24,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      position: 'absolute',
      top: 10,
      left: 10,
    }
    switch (level) {
      case consts.LEVEL_1:
        styles.backgroundColor = '#08f1a9'
        break;
      case consts.LEVEL_2:
        styles.backgroundColor = '#12bccf'
        break;
      case consts.LEVEL_3:
        styles.backgroundColor = '#46435a'
        break;
      case consts.LEVEL_4:
        styles.backgroundColor = '#ffe787'
        break;
      case consts.LEVEL_5:
        styles.backgroundColor = '#a74f84'
        break;
      case consts.LEVEL_6:
        styles.backgroundColor = '#bdbdd9'
        break;
      case consts.LEVEL_7:
        styles.backgroundColor = '#6666ef'
        break;
      default:
        break;
    }
    return styles;
  }

  const viewItemVideo = (item) => {
    return (
      <div className="App_itemVideo" onClick={() => {
       
      }}>
        <div style={getStyleByLevel(item.level)}>{item.level}</div>
        <img className="App_itemVideoThumbnailImg" src={item.thumbnailURL} onClick={() => {
           setVideo({
            ...item,
            viewType: consts.OPEN_MODAL_TYPE_TUTORIAL
          });
        }}/>
        <div className="App_itemVideoTitle" onClick={() => {
           setVideo({
            ...item,
            viewType: consts.OPEN_MODAL_TYPE_TUTORIAL
          });
        }}>
          {item.title}
        </div>
        <div className="App_itemVideoAction">
        <div className="App_itemVideoActionItem">
          <AudioOutlined style={{ fontSize: 24, color: '#6666ef' }} onClick={() => {
            setVideo({
              ...item,
              viewType: consts.OPEN_MODAL_TYPE_AUDIO
            });
          }} />
          </div>
          <div className="App_itemVideoActionItem" onClick={() => {
          setVideo({
            ...item,
            viewType: consts.OPEN_MODAL_TYPE_VIDEO
          });
        }}>
          <VideoCameraOutlined style={{ fontSize: 24, color: '#08f1a9' }} />
          </div>
        </div>
      </div>
    )
  }

  console.log(video)
  return (
    <div className="App_container">
      {(video && video.viewType === consts.OPEN_MODAL_TYPE_TUTORIAL) && <div className="App_videoModal" onClick={() => {
        setVideo(null);
      }}>
        <div className="App_tutorialContainer">
        <div className="App_ModalVideoTitle">{video.title}</div>
          <iframe
              src={`https://www.englishcentral.com/video/${video.id}`} 
              //  title="W3Schools Free Online Web Tutorials"
              >

              </iframe>
          </div>
      </div>}
      {(video && video.viewType === consts.OPEN_MODAL_TYPE_AUDIO) && <div className="App_videoModal" onClick={() => {
        setVideo(null);
      }}>
        <div className="App_AudioContainer">
        <div className="App_ModalVideoTitle">{video.title}</div>
          <ReactAudioPlayer
            src={video.audioUrl}
            autoPlay
            controls
          />
          </div>
      </div>}
      {(video && video.viewType === consts.OPEN_MODAL_TYPE_VIDEO) && <div className="App_videoModal" onClick={() => {
        setVideo(null);
      }}>
        <div className="App_VideoContainer">
        <div className="App_ModalVideoTitle">{video.title}</div>
          <video width="100%" height="100%" autoPlay controls>
            <source src={video.videoUrl} type="video/mp4"  />
          Your browser does not support the video tag.
          </video>
          </div>
      </div>}
      <div className="App_header">
        
        <div className="App_levels">
          {
            listLevels.map((itemLevel, indexLevel) => {
              return (
                <div
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      levels: prev.levels.includes(itemLevel.code) ? prev.levels.filter(item => item !== itemLevel.code) : [
                        ...prev.levels,
                        itemLevel.code
                      ],
                      page: 1,
                    }))
                  }}
                  className={`App_levelItem ${filters.levels.includes(itemLevel.code) ? "active" : ""}`}
                >
                  {itemLevel.name}  
                </div>
              )
            })
          }
        </div>'
      </div>
      <div className="App_body">
        <Row>
          {
            items.map((item, index) => {
              if (items.length === index + 1) {
                return (
                  <Col xs={24} sm={8} md={8} lg={8} xl={6} className="App_itemVideoWrapper" ref={lastElRef}>
                  {viewItemVideo(item)}
                </Col>
                )
              }
              return (
                <Col xs={24} sm={8} md={8} lg={8} xl={6} className="App_itemVideoWrapper">
                  {viewItemVideo(item)}
                </Col>
              )
            })
          }
          {loading && <Col xs={24}>
          <Spin />
          </Col>}
          </Row>
      </div>
    </div>
  );
}

export default App;
