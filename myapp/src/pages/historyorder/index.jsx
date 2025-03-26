import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { PullRefresh, Empty, BackTop, List, Loading } from "@taroify/core";
import HistoryOrderBox from "./components/historyOrderBox";
import Taro from "@tarojs/taro";

const PAGE_SIZE = 5;
const TOTAL_PAGES = 10;

// 模拟请求数据
const mockFetchData = (page) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (page > TOTAL_PAGES) {
        resolve([]);
        return;
      }
      const newData = Array.from({ length: PAGE_SIZE }, (_, i) => ({
        expressid: `10${page}-5-${200 + i}`,
        dromadd: `南湖${Math.floor(Math.random() * 10) + 1}栋${Math.floor(Math.random() * 400) + 100}`,
        orderTime: Date.now() - Math.floor(Math.random() * 1000000000),
        comment: `测试订单 ${page}-${i}`,
        iphoneNumber: `188****${Math.floor(1000 + Math.random() * 9000)}`,
        orderid: `${page}${200 + i}`,
        orderImage: "",
      }));
      resolve(newData);
    }, 500);
  });
};

function HistoryOrder() {
  const [historyOrderData, setHistoryOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  // 下拉刷新
  const handleRefresh = async () => {
    setLoading(true);
    setPage(1);
    setError(false);
    try {
      const newData = await mockFetchData(1);
      setHistoryOrderData(newData);
      setHasMore(newData.length === PAGE_SIZE);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  // 滑动加载更多
  const loadMoreData = async () => {
    if (!hasMore || isFetching || error) return;
    setIsFetching(true);

    try {
      const newPage = page + 1;
      const moreData = await mockFetchData(newPage);
      if (moreData.length > 0) {
        setHistoryOrderData((prev) => [...prev, ...moreData]);
        setPage(newPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(true);
    }

    setIsFetching(false);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleReload = async () => {
    setIsFetching(true); // 启动加载状态
    setError(false);
    try {
      const newData = await mockFetchData(1);
      setHistoryOrderData(newData);
      setHasMore(newData.length === PAGE_SIZE);
      setPage(1); // 确保重置为第一页
    } catch (err) {
      setError(true);
    }
    setIsFetching(false);
  };

  return (
    <PullRefresh
      loading={loading}
      onRefresh={handleRefresh}
      loadingText="刷新中..."
      pullingText="下拉刷新"
      loosingText="释放刷新"
      successText="刷新成功"
    >
      <List loading={isFetching} hasMore={hasMore} onLoad={loadMoreData}>
        {historyOrderData.length === 0 && !loading ? (
          <Empty>
            <Empty.Image />
            <Empty.Description>暂时没有历史订单</Empty.Description>
          </Empty>
        ) : (
          historyOrderData.map((item, index) => (
            <HistoryOrderBox key={index} data={item} />
          ))
        )}
        <List.Placeholder
          onClick={() => {
            if (error) {
              handleReload(); // 点击重新加载时调用新的handleReload方法
            }
          }}
        >
          {isFetching && <Loading>加载中...</Loading>}
          {error && "请求失败，点击重新加载"}
          {!error && !hasMore && (
            <View className="h-32">
              <View className="text-center text-gray-400 text-sm mt-4">
                —— 仅展示最近三个月的订单 ——
              </View>
              <View className="text-center text-gray-400 text-sm mt-1">
                —— 若需获取更多数据请联系相关客服 ——
              </View>
            </View>
          )}
        </List.Placeholder>
      </List>
      <BackTop onClick={() => Taro.pageScrollTo({ scrollTop: 0, duration: 300 })} />
    </PullRefresh>
  );
}

export default HistoryOrder;