import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Typography, Box, CircularProgress, Alert } from '@mui/material';

const openUrl = "https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6";

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(openUrl);
      if (!response.ok) {
        throw new Error("网络请求失败");
      }
      const dataset = await response.json();
      setData(dataset);
      setFilteredData(dataset); // 初始情况下，过滤后的数据与原始数据相同
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);


  const handleSearch = () => {
    const filtered = data.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        (item.showInfo && item.showInfo[0] && 
          (item.showInfo[0].location.toLowerCase().includes(keyword.toLowerCase()) ||
           item.showInfo[0].price.toLowerCase().includes(keyword.toLowerCase())))
    );
    setFilteredData(filtered);
    setCurrentPage(1); // 搜索后重置分页到第一页
  };

  
  const getLocation = (item) => {
    return item.showInfo && item.showInfo[0] ? item.showInfo[0].location : '未知';
  };

  const getPrice = (item) => {
    return item.showInfo && item.showInfo[0] ? item.showInfo[0].price : '未知';
  };


  const columns = [
    { field: 'title', headerName: '名稱', width: 300 },
    { field: 'location', headerName: '地點', width: 300 },
    { field: 'price', headerName: '票價', width: 300 },
  ];

  const rows = filteredData.map((item, index) => ({
    id: index + 1,
    title: item.title,
    location: getLocation(item),
    price: getPrice(item),
  }));

  if (isLoading) {
    return (
      <Box textAlign="center" marginTop="20px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" marginTop="20px">
        <Alert severity="error">錯誤: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box padding="20px">
      <Typography variant="h4">景點觀光展覽資訊</Typography>
      <Box display="flex" alignItems="center" marginBottom="20px">
        <TextField
          id="keyword"
          label="關鍵字"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch}>搜索</Button>
      </Box>

      {filteredData.length === 0 ? (
        <Typography>找不到相關結果</Typography>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={recordsPerPage}
            pagination
            page={currentPage - 1} 
            onPageChange={(params) => setCurrentPage(params.page + 1)}
            rowsPerPageOptions={[10, 20, 50]}
            onPageSizeChange={(params) => setRecordsPerPage(params.pageSize)}
          />
        </div>
      )}
    </Box>
  );
};

export default App;
