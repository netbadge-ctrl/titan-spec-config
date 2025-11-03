import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Settings, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 模拟数据
const mockCustomerRequirements = [
  {
    id: "1",
    customerName: "阿里云",
    createTime: "2024-01-15 10:30:00",
    updateTime: "2024-01-20 14:25:00",
    requirementsCount: 8,
    categories: ["CPU", "Memory", "Storage"],
    status: "active",
  },
  {
    id: "2",
    customerName: "腾讯云",
    createTime: "2024-01-18 09:15:00",
    updateTime: "2024-01-18 09:15:00",
    requirementsCount: 5,
    categories: ["CPU", "GPU"],
    status: "active",
  },
  {
    id: "3",
    customerName: "华为云",
    createTime: "2024-01-10 16:45:00",
    updateTime: "2024-01-22 11:30:00",
    requirementsCount: 12,
    categories: ["CPU", "Memory", "NIC", "Storage", "RAID"],
    status: "active",
  },
];

const RequirementsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = mockCustomerRequirements.filter((item) =>
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* 页面标题和操作栏 */}
        <div className="mb-6 border-b border-border pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                硬件性能指标管理
              </h1>
              <p className="text-sm text-muted-foreground">
                管理客户的服务器硬件性能最低要求配置
              </p>
            </div>
            <Button onClick={() => navigate("/requirements/new")} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              新建配置
            </Button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6 shadow-sm border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">客户列表</CardTitle>
            <CardDescription className="text-sm">
              共 {filteredData.length} 个客户配置
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索客户名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* 数据表格 */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">客户名称</TableHead>
                    <TableHead>配置数量</TableHead>
                    <TableHead>硬件类型</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>更新时间</TableHead>
                    <TableHead className="w-[120px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{item.customerName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {item.requirementsCount} 条
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {item.categories.map((cat) => (
                              <Badge key={cat} variant="outline" className="text-xs font-normal">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.createTime}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.updateTime}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(`/requirements/view/${item.id}`)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(`/requirements/edit/${item.id}`)}
                            >
                              <Settings className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">总配置客户</CardDescription>
              <CardTitle className="text-2xl">{mockCustomerRequirements.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">总配置项</CardDescription>
              <CardTitle className="text-2xl">
                {mockCustomerRequirements.reduce((sum, item) => sum + item.requirementsCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">最近更新</CardDescription>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {mockCustomerRequirements[0]?.updateTime || "-"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequirementsList;
