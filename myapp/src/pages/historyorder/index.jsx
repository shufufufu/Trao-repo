import React from "react";
import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { PullRefresh, Empty , BackTop } from "@taroify/core";
import { usePageScroll } from "@tarojs/taro";
import historyOrderBox from "./components/historyOrderBox";

function HistoryOrder() {
  const [reachTop, setReachTop] = useState(true);
  const [historyOrderData, setHistoryOrderData] = useState([]);
  const [loading, setLoading] = useState(false);


  //检测页面滚动
  usePageScroll(({ scrollTop }) => setReachTop(scrollTop === 0));

  const handleRefresh = async () => {
    setLoading(true);
    const refreshedData = [] // 从后端获取最新数据的逻辑需要根据实际情况进行编写，这里只是一个示例，具体实现可能会涉及到网络请求、数据处理等操作

    setTimeout(() => {
      // 模拟从后端获取历史订单数据

      setHistoryOrderData(refreshedData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleRefresh();
  }, []);


  return (
  <View>
      <PullRefresh
        loading={loading}
        reachTop={reachTop}
        onRefresh={handleRefresh}
        loadingText="刷新中..."
        pullingText="下拉刷新"
        loosingText="释放刷新"
        successText="刷新成功"
      >
      <View className="pb-4">
          {historyOrderData.length === 0 ? (
            <Empty>
              <Empty.Image />
              <Empty.Description>暂时没有历史订单</Empty.Description>
            </Empty>
          ) : (
            <>
              {/*{historyOrderData.map((item, index) => (
                <historyOrderBox key={index} data={item} />
              ))}*/}
              <historyOrderBox/>
            </>
          )}
          <BackTop
            right={30}         // 距离页面右侧的距离
            bottom={40}        // 距离页面底部的距离
            offset={200}       // 滚动高度达到200px时显示 BackTop
            onClick={() => {
              Taro.pageScrollTo({
                scrollTop: 0,
                duration: 300, // 滚动持续时间
              });
            }}
            zIndex={100}       // 层级
          />
        </View>
      
      
      </PullRefresh>
  </View>
    )
}

export default HistoryOrder;
